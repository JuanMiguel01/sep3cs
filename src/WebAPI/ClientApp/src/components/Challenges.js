/* Copyright (c) 2023-2025
 * This file is part of sep3cs.
 *
 * sep3cs is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * sep3cs is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with sep3cs. If not, see <http://www.gnu.org/licenses/>.
 */
import { ApplicationPaths } from '../services/AuthorizeConstants'
import { Button, Table } from 'reactstrap'
import { CreateChallengeCommand } from '../webApiClient.ts'
import { DateTime } from './DateTime'
import { Navigate, useParams } from 'react-router-dom'
import { Pager } from './Pager'
import { TimeSpan } from './TimeSpan'
import { UpdateChallengeCommand } from '../webApiClient.ts'
import { useAuthorize } from '../services/AuthorizeProvider'
import { UserRoles } from '../services/AuthorizeConstants'
import { ChallengeClient } from '../webApiClient.ts'
import React, { useEffect, useState } from 'react'

export function Challenges ()
{
  const { initialPage } = useParams ()
  const { isAuthorized, inRole }= useAuthorize ()
  const [ activePage, setActivePage ] = useState (initialPage ? initialPage : 0)
  const [ hasNextPage, setHasNextPage ] = useState (false)
  const [ hasPreviousPage, setHasPreviousPage ] = useState (false)
  const [ isLoading, setIsLoading ] = useState (false)
  const [ items, setItems ] = useState (undefined)
  const [ totalPages, setTotalPages ] = useState (0)
  const [ challengeClient ] = useState (new ChallengeClient ())

  const pageSize = 10
  const visibleIndices = 5

  const addChallenege = async () =>
    {
      const data = new CreateChallengeCommand ()
        data.beginDay = new Date ()
        data.duration = "00:00:01"
        data.bounty=0
        data.cost=0
        data.description="<no text>"
        data.maxLooses=0
        data.minLevel=0
        data.name="<no text>"

      await challengeClient.create (data)
      setActivePage (-1)
    }

  const removeChallenge = async (item) =>
    {
      await challengeClient.delete (item.id)
      setActivePage (-1)
    }

  const updateChallenge = async (item) =>
    {
      const data = new UpdateChallengeCommand ()
        data.id = item.id
        data.beginDay = item.beginDay
        data.bounty=item.bounty
        data.duration = item.duration
        data.cost=item.cost
        data.description=item.description
        data.maxLooses=item.maxLooses
        data.minLevel=item.minLevel
        data.name=item.name
        
      await challengeClient.update (item.id, data)
    }

  useEffect (() =>
    {
      const lastPage = async () =>
        {
          const paginatedList = await challengeClient.getWithPagination (1, pageSize)
          return paginatedList.totalPages
        }

      const refreshPage = async () =>
        {
          const paginatedList = await challengeClient.getWithPagination (activePage + 1, pageSize)

          setHasNextPage (paginatedList.hasNextPage)
          setHasPreviousPage (paginatedList.hasPreviousPage)
          setItems (paginatedList.items)
          setTotalPages (paginatedList.totalPages)
        }

      if (activePage >= 0)
        {
          setIsLoading (true)
          refreshPage ().then (() => setIsLoading (false))
        }
      else
        {
          lastPage ().then ((total) =>
            {
              if (total === 0)
                setActivePage (0)
              else
                setActivePage (total - 1)
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePage])

  return (
    isLoading
    ? (<div></div>)
    : (
    !isAuthorized
    ? (<Navigate to={ApplicationPaths.Login} />)
    : (
      <>
        <div className='d-flex justify-content-center'>
          <Pager
            activePage={activePage}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onPageChanged={(index) => setActivePage (index)}
            totalPages={totalPages}
            visibleIndices={visibleIndices} />
        </div>
        <div>
          <Table>
            <thead>
              <tr>
                <th>{'#'}</th>
                <th>{'Begin day'}</th>
                <th>{'Duration'}</th>
                <th>{'Bounty'}</th>
                <th>{'Cost'}</th>
                <th>{'Description'}</th>
                <th>{'MaxLooses'}</th>
                <th>{'MinLevel'}</th>
                <th>{'Name'}</th>

                <th />
              </tr>
            </thead>
            <tbody>
        { (items ?? []).map ((item, index) => (
              <tr key={`body${index}`}>
                <th scope="row">{ item.id }</th>
                <td>
                  <DateTime
                    defaultValue={item.beginDay}
                    onChanged={(date) => { item.beginDay = date; updateChallenge (item) }}
                    readOnly={!inRole[UserRoles.Administrator]} />
                </td>
                <td>
                  <TimeSpan
                    defaultValue={item.duration}
                    onChanged={(span) => { item.duration = span; updateChallenge (item) }}
                    readOnly={!inRole[UserRoles.Administrator]} />
                </td>
                <td>
                  <input
                    type='text'
                    defaultValue={item.bounty}
                    onChanged={(number) => { item.bounty = number; updateChallenge (item) }}
                    readOnly={!inRole[UserRoles.Administrator]} />
                </td>
                <td>
                  <input
                    type='number'
                    defaultValue={item.cost}
                    onChanged={(number) => { item.cost = number; updateChallenge (item) }}
                    readOnly={!inRole[UserRoles.Administrator]} />
                </td>
                <td>
                  <input
                    type='text'
                    defaultValue={item.description}
                    onChanged={(string) => { item.description = string; updateChallenge (item) }}
                    readOnly={!inRole[UserRoles.Administrator]} />
                </td>
                <td>
                  <input
                    type='number'
                    defaultValue={item.maxLooses}
                    onChanged={(number) => { item.maxLooses = number; updateChallenge (item) }}
                    readOnly={!inRole[UserRoles.Administrator]} />
                </td>
                <td>
                  <input
                    type='number'
                    defaultValue={item.minLevel}
                    onChanged={(number) => { item.minLevel = number; updateChallenge (item) }}
                    readOnly={!inRole[UserRoles.Administrator]} />
                </td>
                <td>
                  <input
                    type='text'
                    defaultValue={item.name}
                    onChanged={(string) => { item.name = string; updateChallenge (item) }}
                    readOnly={!inRole[UserRoles.Administrator]} />
                </td>

        {
          (!inRole[UserRoles.Administrator])
          ? (<td />)
          : (
                <td>
                  <Button color='primary' onClick={() => removeChallenge (item)} close />
                </td>)
        }
              </tr>))
        }
            </tbody>
            <tfoot>
        {
          (!inRole[UserRoles.Administrator])
          ? (<tr />)
          : (
              <tr key='footer0'>
                <td>
                  <Button color='primary' onClick={() => addChallenege ()}>+</Button>
                </td>
                <td /><td /><td />
              </tr>)
        }
            </tfoot>
          </Table>
        </div>
      </>)))
}